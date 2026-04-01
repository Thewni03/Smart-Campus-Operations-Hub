# Smart-Campus-Operations-Hub

## Backend setup

This backend is configured as a Spring Boot Maven project using:

- Spring Web
- Spring Security
- Spring Validation
- Spring Data MongoDB

### Install requirements from terminal

1. Install Java 21
2. Install Maven 3.9+
3. Run the commands below from the project root

```bash
mvn clean install
mvn spring-boot:run
```

### macOS install commands

```bash
brew install openjdk@21
brew install maven
```

If Java 21 is not active yet, use:

```bash
export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"
java -version
mvn -version
```

### Frontend setup

```bash
cd Frontend
npm install
npm run dev
```
