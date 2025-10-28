package com.ar.edu.unnoba.poo2025; // Fijate que el paquete es distinto

import com.ar.edu.unnoba.poo2025.torneos.util.PasswordEncoder; // Importas tu clase
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean; // Importas @Bean

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

 
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new PasswordEncoder();
    }
}