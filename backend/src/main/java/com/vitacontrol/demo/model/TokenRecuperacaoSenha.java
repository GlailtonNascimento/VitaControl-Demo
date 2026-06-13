package com.vitacontrol.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_tokens_recuperacao")
public class TokenRecuperacaoSenha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDateTime dataExpiracao;

    // Construtor Padrão
    public TokenRecuperacaoSenha() {}

    // Construtor Prático
    public TokenRecuperacaoSenha(String token, Usuario usuario, int minutosValidade) {
        this.token = token;
        this.usuario = usuario;
        this.dataExpiracao = LocalDateTime.now().plusMinutes(minutosValidade);
    }

    // Métodos Auxiliares
    public boolean estaExpirado() {
        return LocalDateTime.now().isAfter(this.dataExpiracao);
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public LocalDateTime getDataExpiracao() { return dataExpiracao; }
    public void setDataExpiracao(LocalDateTime dataExpiracao) { this.dataExpiracao = dataExpiracao; }
}

