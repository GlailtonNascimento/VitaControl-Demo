package com.vitacontrol.demo.service;

import com.vitacontrol.demo.model.TokenRecuperacaoSenha;
import com.vitacontrol.demo.model.Usuario;
import com.vitacontrol.demo.repository.TokenRecuperacaoSenhaRepository;
import com.vitacontrol.demo.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AutenticacaoService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TokenRecuperacaoSenhaRepository tokenRepository;

    @Autowired(required = false)  // ← para não quebrar sem e-mail
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public String solicitarRecuperacaoSenha(String email) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(email);
        if (usuarioOpt.isEmpty()) {
            return "E-mail não encontrado!";
        }

        Usuario usuario = usuarioOpt.get();
        
        // Gerar token único
        String token = UUID.randomUUID().toString();
        
        // Salvar token no banco com expiração (1 hora)
        TokenRecuperacaoSenha tokenRecuperacao = new TokenRecuperacaoSenha();
        tokenRecuperacao.setToken(token);
        tokenRecuperacao.setUsuario(usuario);
        tokenRecuperacao.setDataExpiracao(LocalDateTime.now().plusHours(1));
        tokenRepository.save(tokenRecuperacao);
        
        // Enviar e-mail
        if (mailSender != null) {
            enviarEmailRecuperacao(usuario.getUsername(), token);
            return "E-mail de recuperação enviado para " + email;
        } else {
            return "Token gerado (e-mail não configurado): " + token;
        }
    }

    private void enviarEmailRecuperacao(String email, String token) {
        if (mailSender == null) return;
        
        String link = "http://localhost:4200/redefinir-senha?token=" + token;
        String assunto = "Recuperação de Senha - VitaControl";
        String mensagem = "Olá!\n\n" +
                          "Clique no link abaixo para redefinir sua senha:\n\n" +
                          link + "\n\n" +
                          "Este link é válido por 1 hora.\n\n" +
                          "Se você não solicitou esta recuperação, ignore este e-mail.\n\n" +
                          "Atenciosamente,\n" +
                          "Equipe VitaControl";
        
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(email);
        mailMessage.setSubject(assunto);
        mailMessage.setText(mensagem);
        mailSender.send(mailMessage);
    }

    @Transactional
    public String redefinirSenha(String token, String novaSenha) {
        Optional<TokenRecuperacaoSenha> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            return "Token inválido!";
        }

        TokenRecuperacaoSenha tokenRecuperacao = tokenOpt.get();
        
        // Verificar se o token está expirado
        if (tokenRecuperacao.getDataExpiracao().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(tokenRecuperacao);
            return "Token expirado! Solicite uma nova recuperação.";
        }

        // Atualizar senha
        Usuario usuario = tokenRecuperacao.getUsuario();
        usuario.setPassword(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);
        
        // Deletar token usado
        tokenRepository.delete(tokenRecuperacao);
        
        return "Senha redefinida com sucesso!";
    }
}
