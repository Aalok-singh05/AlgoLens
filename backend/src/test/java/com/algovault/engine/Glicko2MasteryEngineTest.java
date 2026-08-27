package com.algovault.engine;

import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class Glicko2MasteryEngineTest {

    private final Glicko2MasteryEngine engine = new Glicko2MasteryEngine();

    @Test
    void updateRating_noMatches_decaysRatingDeviation() {
        Glicko2MasteryEngine.GlickoRating initial = new Glicko2MasteryEngine.GlickoRating(1500.0, 200.0, 0.06);
        Glicko2MasteryEngine.GlickoRating updated = engine.updateRating(initial, null);

        assertEquals(1500.0, updated.rating, 0.0001);
        assertTrue(updated.rd > 200.0, "RD should increase in empty rating period (time decay)");
        assertTrue(updated.rd <= 350.0, "RD should not exceed max RD ceiling 350");
        assertEquals(0.06, updated.volatility, 0.0001);
    }

    @Test
    void updateRating_singleWinAgainstLowerRated_increasesRatingDecreasesRD() {
        Glicko2MasteryEngine.GlickoRating initial = new Glicko2MasteryEngine.GlickoRating(1500.0, 200.0, 0.06);
        List<Glicko2MasteryEngine.MatchResult> matches = List.of(
            new Glicko2MasteryEngine.MatchResult(1400.0, 30.0, 1.0)
        );

        Glicko2MasteryEngine.GlickoRating updated = engine.updateRating(initial, matches);

        assertTrue(updated.rating > 1500.0, "Winning against lower rated opponent must increase rating");
        assertTrue(updated.rd < 200.0, "Playing a match must decrease uncertainty (RD)");
        assertTrue(updated.volatility > 0.0, "Volatility must remain positive");
    }

    @Test
    void updateRating_singleLossAgainstHigherRated_decreasesRatingDecreasesRD() {
        Glicko2MasteryEngine.GlickoRating initial = new Glicko2MasteryEngine.GlickoRating(1500.0, 200.0, 0.06);
        List<Glicko2MasteryEngine.MatchResult> matches = List.of(
            new Glicko2MasteryEngine.MatchResult(1600.0, 30.0, 0.0)
        );

        Glicko2MasteryEngine.GlickoRating updated = engine.updateRating(initial, matches);

        assertTrue(updated.rating < 1500.0, "Losing against higher rated opponent must decrease rating");
        assertTrue(updated.rd < 200.0, "Playing a match must decrease uncertainty (RD)");
        assertTrue(updated.volatility > 0.0, "Volatility must remain positive");
    }

    @Test
    void updateRating_multipleMatchesInOnePeriod_monthlyBatch() {
        // Player: 1500 / 350 / 0.06
        // Matches: 1300 win, 1400 draw, 1500 loss
        Glicko2MasteryEngine.GlickoRating initial = new Glicko2MasteryEngine.GlickoRating(1500.0, 350.0, 0.06);
        List<Glicko2MasteryEngine.MatchResult> matches = List.of(
            new Glicko2MasteryEngine.MatchResult(1300.0, 50.0, 1.0),
            new Glicko2MasteryEngine.MatchResult(1400.0, 50.0, 0.5),
            new Glicko2MasteryEngine.MatchResult(1500.0, 50.0, 0.0)
        );

        Glicko2MasteryEngine.GlickoRating updated = engine.updateRating(initial, matches);

        assertTrue(Double.isFinite(updated.rating));
        assertTrue(Double.isFinite(updated.rd));
        assertTrue(Double.isFinite(updated.volatility));
        assertTrue(updated.rd < 350.0, "Rating deviation must decrease after 3 matches");
        assertTrue(updated.volatility > 0.001 && updated.volatility < 1.0);
    }

    @Test
    void updateRating_degenerateVariance_recoversGracefully() {
        Glicko2MasteryEngine.GlickoRating initial = new Glicko2MasteryEngine.GlickoRating(1500.0, 350.0, 0.06);
        List<Glicko2MasteryEngine.MatchResult> matches = new ArrayList<>();

        Glicko2MasteryEngine.GlickoRating updated = engine.updateRating(initial, matches);

        assertNotNull(updated);
        assertFalse(Double.isNaN(updated.rating));
        assertFalse(Double.isNaN(updated.rd));
        assertFalse(Double.isNaN(updated.volatility));
    }

    @Test
    void updateRating_volatilityStaysWithinSaneBoundsOverManyRounds() {
        Glicko2MasteryEngine.GlickoRating current = new Glicko2MasteryEngine.GlickoRating(1500.0, 350.0, 0.06);

        for (int i = 0; i < 20; i++) {
            List<Glicko2MasteryEngine.MatchResult> matches = List.of(
                new Glicko2MasteryEngine.MatchResult(1500.0 + (i % 3) * 50, 50.0, i % 2 == 0 ? 1.0 : 0.0)
            );
            current = engine.updateRating(current, matches);
            assertTrue(current.volatility > 0.001 && current.volatility < 1.0,
                "Volatility must remain bounded between 0.001 and 1.0, was " + current.volatility);
        }
    }

    @Test
    void helperFunctions_gAndE_computeAccurately() {
        // When phi = 0, g(0) = 1.0
        assertEquals(1.0, engine.g(0.0), 0.0001);

        // When mu == muJ, expected score is 0.5 regardless of phiJ
        assertEquals(0.5, engine.E(0.0, 0.0, 0.0), 0.0001);
        assertEquals(0.5, engine.E(1.0, 1.0, 0.5), 0.0001);

        // Positive skill difference gives > 0.5 probability
        assertTrue(engine.E(1.0, 0.0, 0.2) > 0.5);
    }

    @Test
    void glickoRating_toString_formatsCorrectly() {
        Glicko2MasteryEngine.GlickoRating rating = new Glicko2MasteryEngine.GlickoRating(1523.45, 120.67, 0.059876);
        assertEquals("GlickoRating{rating=1523.45, rd=120.67, volatility=0.059876}", rating.toString());
    }

    @Test
    void matchResult_inputValidation_rejectsInvalidInputs() {
        assertThrows(IllegalArgumentException.class, () ->
            new Glicko2MasteryEngine.MatchResult(Double.NaN, 50.0, 1.0));
        assertThrows(IllegalArgumentException.class, () ->
            new Glicko2MasteryEngine.MatchResult(1500.0, -10.0, 1.0));
        assertThrows(IllegalArgumentException.class, () ->
            new Glicko2MasteryEngine.MatchResult(1500.0, 50.0, 1.5));
        assertThrows(IllegalArgumentException.class, () ->
            new Glicko2MasteryEngine.MatchResult(1500.0, 50.0, -0.1));
    }

    @Test
    void solveProbabilityEngine_withRealFocusSeconds_calculatesAccurateMedianMinutes() {
        SolveProbabilityEngine solveEngine = new SolveProbabilityEngine();
        com.algovault.model.User user = com.algovault.model.User.builder().id(1L).build();
        com.algovault.model.Problem targetProblem = com.algovault.model.Problem.builder().id(100L).titleSlug("target-problem").actualRating(1600.0).build();

        com.algovault.model.Problem comp1 = com.algovault.model.Problem.builder().id(101L).actualRating(1580.0).build();
        com.algovault.model.Problem comp2 = com.algovault.model.Problem.builder().id(102L).actualRating(1610.0).build();
        com.algovault.model.Problem comp3 = com.algovault.model.Problem.builder().id(103L).actualRating(1650.0).build();

        List<com.algovault.model.ProblemOpenEvent> realEvents = List.of(
            com.algovault.model.ProblemOpenEvent.builder().problem(comp1).focusSeconds(600).solved(true).build(),   // 10 mins
            com.algovault.model.ProblemOpenEvent.builder().problem(comp2).focusSeconds(1200).solved(true).build(),  // 20 mins
            com.algovault.model.ProblemOpenEvent.builder().problem(comp3).focusSeconds(1800).solved(true).build()   // 30 mins
        );

        com.algovault.dto.PredictionResponse response = solveEngine.predict(user, targetProblem, List.of(), List.of(), List.of(), realEvents);

        assertNotNull(response);
        assertEquals(20, response.getExpectedTimeMinutes(), "Median of 10, 20, 30 minutes must equal 20 minutes");
    }
}
