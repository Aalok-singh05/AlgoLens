FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S algovault && adduser -S algovault -G algovault
WORKDIR /app
COPY --from=build /app/target/algovault-backend-*.jar app.jar
RUN chown -R algovault:algovault /app
USER algovault
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
