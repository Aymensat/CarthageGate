// src/main/java/org/example/soap/config/WebServiceConfig.java
package org.example.soap.config;

import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.ws.config.annotation.EnableWs;
import org.springframework.ws.config.annotation.WsConfigurerAdapter;
import org.springframework.ws.transport.http.MessageDispatcherServlet;
import org.springframework.ws.wsdl.wsdl11.DefaultWsdl11Definition;
import org.springframework.xml.xsd.SimpleXsdSchema;
import org.springframework.xml.xsd.XsdSchema;

/**
 * SOAP WEB SERVICE CONFIGURATION
 * ═══════════════════════════════
 * 
 * This class configures how Spring handles SOAP requests.
 * 
 * WHAT GETS CONFIGURED:
 * ─────────────────────
 * 1. Servlet that receives SOAP requests
 * 2. WSDL generation from your XSD
 * 3. URL where the service is available
 */
 @EnableWs  // Enables Spring Web Services
 @Configuration
public class WebServiceConfig extends WsConfigurerAdapter {

    /**
     * Register the SOAP message dispatcher servlet.
     * 
     * This servlet:
     * - Listens at /ws/*
     * - Receives SOAP XML requests
     * - Routes to appropriate @Endpoint methods
     */
    @Bean
    public ServletRegistrationBean<MessageDispatcherServlet> messageDispatcherServlet(
            ApplicationContext applicationContext) {
        
        MessageDispatcherServlet servlet = new MessageDispatcherServlet();
        servlet.setApplicationContext(applicationContext);
        servlet.setTransformWsdlLocations(true);  // Adjusts URLs in WSDL
        
        return new ServletRegistrationBean<>(servlet, "/ws/*");
    }

    /**
     * Generate WSDL from your XSD.
     * 
     * WSDL (Web Services Description Language) is the "contract" that tells
     * clients how to call your SOAP service.
     * 
     * Access at: http://localhost:8081/ws/airQuality.wsdl
     * 
     * The "airQuality" name comes from the @Bean method name!
     */
    @Bean(name = "airQuality")  // WSDL will be named airQuality.wsdl
    public DefaultWsdl11Definition defaultWsdl11Definition(XsdSchema airQualitySchema) {
        DefaultWsdl11Definition wsdl = new DefaultWsdl11Definition();
        
        wsdl.setPortTypeName("AirQualityPort");
        wsdl.setLocationUri("/ws");  // URL path
        wsdl.setTargetNamespace("http://example.com/air-quality-service");
        wsdl.setSchema(airQualitySchema);
        
        return wsdl;
    }

    /**
     * Load the XSD schema file.
     */
    @Bean
    public XsdSchema airQualitySchema() {
        return new SimpleXsdSchema(new ClassPathResource("xsd/air-quality.xsd"));
    }
}