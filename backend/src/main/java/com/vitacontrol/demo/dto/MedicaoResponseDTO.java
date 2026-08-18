package com.vitacontrol.demo.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class MedicaoResponseDTO {
    private UUID id;
    private Long usuarioId;
    private String usuarioUsername;
    private String usuarioNome;
    private LocalDateTime dataHora;
    private Integer sistolica;
    private Integer diastolica;
    private Integer pulsacao;
    private String contexto;

    // Construtor com todos os campos
    public MedicaoResponseDTO(UUID id, Long usuarioId, String usuarioUsername, String usuarioNome,
                              LocalDateTime dataHora, Integer sistolica, Integer diastolica,
                              Integer pulsacao, String contexto) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.usuarioUsername = usuarioUsername;
        this.usuarioNome = usuarioNome;
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
    public String getUsuarioUsername() { return usuarioUsername; }
    public void setUsuarioUsername(String usuarioUsername) { this.usuarioUsername = usuarioUsername; }
    public String getUsuarioNome() { return usuarioNome; }
    public void setUsuarioNome(String usuarioNome) { this.usuarioNome = usuarioNome; }
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
    public Integer getSistolica() { return sistolica; }
    public void setSistolica(Integer sistolica) { this.sistolica = sistolica; }
    public Integer getDiastolica() { return diastolica; }
    public void setDiastolica(Integer diastolica) { this.diastolica = diastolica; }
    public Integer getPulsacao() { return pulsacao; }
    public void setPulsacao(Integer pulsacao) { this.pulsacao = pulsacao; }
    public String getContexto() { return contexto; }
    public void setContexto(String contexto) { this.contexto = contexto; }
}
