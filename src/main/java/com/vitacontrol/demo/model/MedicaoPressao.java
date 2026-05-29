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

    private Long usuarioId;
    private LocalDateTime dataHora;
    private Short sistolica;
    private Short diastolica;
    private Short pulsacao;
    private String contexto;

    public MedicaoPressao() {}

    public MedicaoPressao(Long usuarioId, LocalDateTime dataHora, Short sistolica, Short diastolica, Short pulsacao, String contexto) {
        this.usuarioId = usuarioId;
        this.dataHora = dataHora;
        this.sistolica = sistolica;
        this.diastolica = diastolica;
        this.pulsacao = pulsacao;
        this.contexto = contexto;
    }

    // Getters e Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
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
