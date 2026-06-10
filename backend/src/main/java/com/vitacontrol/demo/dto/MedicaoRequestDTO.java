package com.vitacontrol.demo.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class MedicaoRequestDTO {

    @NotNull(message = "A pressão sistólica é obrigatória.")
    @Min(value = 40, message = "A pressão sistólica mínima aceitável é 40 mmHg.")
    @Max(value = 300, message = "A pressão sistólica máxima aceitável é 300 mmHg.")
    private Short sistolica;

    @NotNull(message = "A pressão diastólica é obrigatória.")
    @Min(value = 30, message = "A pressão diastólica mínima aceitável é 30 mmHg.")
    @Max(value = 200, message = "A pressão diastólica máxima aceitável é 200 mmHg.")
    private Short diastolica;

    @Min(value = 30, message = "A pulsação mínima aceitável é 30 bpm.")
    @Max(value = 250, message = "A pulsação máxima aceitável é 250 bpm.")
    private Short pulsacao;

    @Size(max = 255, message = "O contexto não pode passar de 255 caracteres.")
    private String contexto;

    // Getters e Setters
    public Short getSistolica() { return sistolica; }
    public void setSistolica(Short sistolica) { this.sistolica = sistolica; }

    public Short getDiastolica() { return diastolica; }
    public void setDiastolica(Short diastolica) { this.diastolica = diastolica; }

    public Short getPulsacao() { return pulsacao; }
    public void setPulsacao(Short pulsacao) { this.pulsacao = pulsacao; }

    public String getContexto() { return contexto; }
    public void setContexto(String contexto) { this.contexto = contexto; }
}
