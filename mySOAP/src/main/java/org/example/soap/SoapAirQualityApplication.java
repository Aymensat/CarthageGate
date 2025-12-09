// src/main/java/org/example/soap/SoapAirQualityApplication.java
package org.example.soap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * MAIN APPLICATION CLASS
 * ═══════════════════════
 * 
 * @SpringBootApplication combines:
 * - @Configuration: This class can define @Bean methods
 * - @EnableAutoConfiguration: Spring configures things automatically
 * - @ComponentScan: Finds @Configuration, @Repository, @Endpoint in this package
 */
 @SpringBootApplication
public class SoapAirQualityApplication {
    public static void main(String[] args) {
        SpringApplication.run(SoapAirQualityApplication.class, args);
        System.out.println("""

            ╔═══════════════════════════════════════════════════════════╗
            ║     SOAP Air Quality Service Started Successfully!       ║
            ╠═══════════════════════════════════════════════════════════╣
            ║  WSDL:     http://localhost:8081/ws/airQuality.wsdl      ║
            ║  H2 Console: http://localhost:8081/h2-console            ║
            ╚═══════════════════════════════════════════════════════════╝
            """);
    }
}