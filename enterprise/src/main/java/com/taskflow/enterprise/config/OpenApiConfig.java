package com.taskflow.enterprise.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact; // Importação corrigida para classe de modelo
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License; // Importação corrigida para classe de modelo
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuracao customizada do OpenAPI / Swagger UI.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI taskflowOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("TaskFlow Enterprise API")
                        .description("API REST para gerenciamento de tarefas e projetos")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("Equipe TaskFlow")
                                .email("dev@taskflow.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")));
    }
}
