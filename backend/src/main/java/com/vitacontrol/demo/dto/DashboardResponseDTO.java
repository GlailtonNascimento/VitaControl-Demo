package com.vitacontrol.demo.dto;

public class DashboardResponseDTO {
    private long totalMedicoes;
    private double mediaSistolica;
    private double mediaDiastolica;
    private double mediaPulsacao;
    private String statusGeral;

    public DashboardResponseDTO(long totalMedicoes, double mediaSistolica, double mediaDiastolica, double mediaPulsacao, String statusGeral) {
        this.totalMedicoes = totalMedicoes;
        this.mediaSistolica = mediaSistolica;
        this.mediaDiastolica = mediaDiastolica;
        this.mediaPulsacao = mediaPulsacao;
        this.statusGeral = statusGeral;
    }

    // Getters e Setters
    public long getTotalMedicoes() { return totalMedicoes; }
    public void setTotalMedicoes(long totalMedicoes) { this.totalMedicoes = totalMedicoes; }

    public double getMediaSistolica() { return mediaSistolica; }
    public void setMediaSistolica(double mediaSistolica) { this.mediaSistolica = mediaSistolica; }

    public double getMediaDiastolica() { return mediaDiastolica; }
    public void setMediaDiastolica(double mediaDiastolica) { this.mediaDiastolica = mediaDiastolica; }

    public double getMediaPulsacao() { return mediaPulsacao; }
    public void setMediaPulsacao(double mediaPulsacao) { this.mediaPulsacao = mediaPulsacao; }

    public String getStatusGeral() { return statusGeral; }
    public void setStatusGeral(String statusGeral) { this.statusGeral = statusGeral; }
}
