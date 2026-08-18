package com.vitacontrol.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "medicamentos")
public class Medicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(length = 50)
    private String dosagem;

    @Column(nullable = false, length = 10)
    private String horario;

    @Column(name = "frequencia_dias")
    private Integer frequenciaDias = 1;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    public Medicamento() {}

    public Medicamento(Usuario usuario, String nome, String dosagem, String horario, Integer frequenciaDias) {
        this.usuario = usuario;
        this.nome = nome;
        this.dosagem = dosagem;
        this.horario = horario;
        this.frequenciaDias = frequenciaDias;
        this.criadoEm = LocalDateTime.now();
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getDosagem() { return dosagem; }
    public void setDosagem(String dosagem) { this.dosagem = dosagem; }
    public String getHorario() { return horario; }
    public void setHorario(String horario) { this.horario = horario; }
    public Integer getFrequenciaDias() { return frequenciaDias; }
    public void setFrequenciaDias(Integer frequenciaDias) { this.frequenciaDias = frequenciaDias; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
}
