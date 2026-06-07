package com.vitacontrol.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "medicao_pressao")
public class MedicaoPressao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Relacionamento forte para isolamento rigoroso de escopo por usuário autenticado
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    private LocalDateTime dataHora;
    private Short sistolica;
    private Short diastolica;
    private Short pulsacao;
    private String contexto;

    public MedicaoPressao() {}

    public MedicaoPressao(Usuario usuario, LocalDateTime dataHora, Short sistolica, Short diastolica, Short pulsacao, String contexto) {
        this.usuario = usuario;
        this.dataHora = dataHora;
        this.sistolica = sistolica;
        this.diastolica = diastolica;
        this.pulsacao = pulsacao;
        this.contexto = contexto;
    }

    // Getters e Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }

    public Short getSistolica() { return sistolica; }
    public void setSistolica(Short sistolica) { this.sistolica = sistolica; }

    public Short getDiastolica() { return diastolica; }
    public void setDiastolica(Short diastolica) { this.diastolica = diastolica; }

    public Short getPulsacao() { return pulsacao; }
    public void setPulsacao(Short pulsacao) { this.pulsacao = pulsacao; }

    public String getContexto() { return contexto; }
    public void setContexto(String contexto) { this.contexto = contexto; }
}
