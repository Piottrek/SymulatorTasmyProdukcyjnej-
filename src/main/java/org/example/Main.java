package org.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Ta adnotacja jest KLUCZOWA - mówi, że to jest aplikacja Spring Boot
@SpringBootApplication
public class Main {
    public static void main(String[] args) {
        // To polecenie uruchamia serwer Tomcat, bazę danych i całą magię Springa
        SpringApplication.run(Main.class, args);
    }
}