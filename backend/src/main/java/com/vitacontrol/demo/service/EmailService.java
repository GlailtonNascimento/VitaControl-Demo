package com.vitacontrol.demo.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${sendgrid.api.key}")
    private String apiKey;

    @Value("${sendgrid.from.email}")
    private String fromEmail;

    public void enviarCodigoRecuperacao(String para, String codigo) {
        try {
            Email from = new Email(fromEmail);
            Email to = new Email(para);
            String subject = "🔐 Código de recuperação - VitaControl";
            String body = "Olá,\n\nSeu código de recuperação de senha é: " + codigo +
                          "\n\nEle é válido por 15 minutos.\n\nAtenciosamente,\nEquipe VitaControl";

            Content content = new Content("text/plain", body);
            Mail mail = new Mail(from, subject, to, content);

            SendGrid sg = new SendGrid(apiKey);
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);
            System.out.println("📧 E-mail enviado para " + para + " - Status: " + response.getStatusCode());
        } catch (Exception e) {
            System.err.println("❌ Erro ao enviar e-mail: " + e.getMessage());
        }
    }
}
