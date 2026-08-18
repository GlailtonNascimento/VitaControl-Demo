package com.vitacontrol.demo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, Long> tentativas = new ConcurrentHashMap<>();
    private final Map<String, Long> bloqueios = new ConcurrentHashMap<>();
    private static final int LIMITE = 10;
    private static final long TEMPO_JANELA = 60000; // 1 minuto

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Aplica apenas nas rotas de login e recuperação
        if (!path.equals("/api/auth/login") && !path.equals("/api/auth/recuperar-senha")) {
            chain.doFilter(request, response);
            return;
        }

        String ip = request.getRemoteAddr();

        // Verifica se está bloqueado
        Long desbloqueio = bloqueios.get(ip);
        if (desbloqueio != null && System.currentTimeMillis() < desbloqueio) {
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write("{\"mensagem\":\"Muitas tentativas. Aguarde 1 minuto.\"}");
            return;
        } else if (desbloqueio != null) {
            bloqueios.remove(ip);
            tentativas.remove(ip);
        }

        // Conta tentativas
        Long contagem = tentativas.getOrDefault(ip, 0L);
        if (contagem >= LIMITE) {
            bloqueios.put(ip, System.currentTimeMillis() + TEMPO_JANELA);
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write("{\"mensagem\":\"Muitas tentativas. Aguarde 1 minuto.\"}");
            return;
        }

        tentativas.put(ip, contagem + 1);

        // Reseta contagem após 1 minuto (em background)
        new Thread(() -> {
            try {
                Thread.sleep(TEMPO_JANELA);
                tentativas.remove(ip);
            } catch (InterruptedException ignored) {}
        }).start();

        chain.doFilter(request, response);
    }
}

