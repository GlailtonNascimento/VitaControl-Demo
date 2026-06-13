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

import java.util.Optional;
import java.util.UUID;

@Service
public class AutenticacaoService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TokenRecuperacaoSenhaRepository tokenRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public String solicitarRecuperacaoSenha(String email) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(email);
        if (usuarioOpt.isEmpty()) {
            return "Se o e-mail existir no sistema, um link será enviado.";
        }
        Usuario usuario = usuarioOpt.get();
        tokenRepository.deleteByUsuario(usuario);
        String tokenAleatorio = UUID.randomUUID().toString();
        TokenRecuperacaoSenha novoToken = new TokenRecuperacaoSenha(tokenAleatorio, usuario, 15);
        tokenRepository.save(novoToken);
        enviarEmail(email, tokenAleatorio);
        return tokenAleatorio;
    }

    @Transactional
    public void atualizarSenhaComToken(String token, String novaSenha) {
        Optional<TokenRecuperacaoSenha> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            throw new IllegalArgumentException("Token inválido ou expirado.");
        }
        TokenRecuperacaoSenha tokenRecuperacao = tokenOpt.get();
        Usuario usuario = tokenRecuperacao.getUsuario();
        usuario.setPassword(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);
        tokenRepository.delete(tokenRecuperacao);
    }

    private void enviarEmail(String emailDestinatario, String token) {
        String linkRedefinicao = "http://localhost:4200/redefinir-senha?token=" + token;
        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setTo(emailDestinatario);
        mensagem.setSubject("Recuperação de Senha - VitaControl");
        mensagem.setText("Olá! Use este link para redefinir sua senha: " + linkRedefinicao 
                        + "\n\nVálido por 15 minutos.");
        mailSender.send(mensagem);
    }
}

