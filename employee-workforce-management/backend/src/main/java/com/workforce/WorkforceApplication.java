package com.workforce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
public class WorkforceApplication {

    public static void main(String[] args) {
        SpringApplication.run(WorkforceApplication.class, args);
        System.out.println("==================================================================");
        System.out.println(" Employee Workforce Management System Backend is running!");
        System.out.println(" Swagger API Docs: http://localhost:8080/swagger-ui.html");
        System.out.println(" REST API Base:    http://localhost:8080/api");
        System.out.println("==================================================================");
    }
}
