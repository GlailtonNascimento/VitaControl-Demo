package com.vitacontrol.demo.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    // Armazenamento dos limites por usuário em memória
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    // Define a regra: 10 requisições que se regeneram a cada 1 minuto
    private Bucket criarNovoBucket() {
        Refill refill = Refill.intervally(10, Duration.ofMinutes(1));
        Bandwidth limite = Bandwidth.classic(10, refill);
        return Bucket.builder().addLimit(limite).build();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String path = request.getRequestURI();
        String method = request.getMethod();

        // intercepta apenas o POST em /api/medicao
        if (path.startsWith("/api/medicao") && "POST".equalsIgnoreCase(method)) {
            
            // Pega o ID do usuário para aplicar a restrição individual
            String usuarioId = request.getParameter("usuarioId");
            if (usuarioId == null) {
                usuarioId = "default_user";
            }

            Bucket bucket = buckets.computeIfAbsent(usuarioId, k -> criarNovoBucket());
            ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

            if (!probe.isConsumed()) {
                long segundosParaEsperar = Duration.ofNanos(probe.getNanosToWaitForRefill()).toSeconds();
                
                // Retorna HTTP 429 (Too Many Requests) com a mensagem amigável
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.setCharacterEncoding("UTF-8");

                String jsonResposta = String.format("{\"erro\":\"Muitas requisições. Tente novamente em %d segundos.\"}", segundosParaEsperar);
                response.getWriter().write(jsonResposta);
                return; // Bloqueia a requisição aqui
            }
        }

        // Se estiver tudo certo ou for outro endpoint, segue o fluxo normal
        filterChain.doFilter(request, response);
    }
}

