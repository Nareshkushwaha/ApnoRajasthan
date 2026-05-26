package com.aapno.aapnorajasthan.service;

import com.aapno.aapnorajasthan.entity.User;
import com.aapno.aapnorajasthan.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    // OTP save karne ke liye temporary storage
    private Map<String, String> otpStorage = new HashMap<>();

    public User createUser(User user) { return userRepository.save(user); }
    public List<User> getAllUsers() { return userRepository.findAll(); }
    public User getUserById(Long id) { return userRepository.findById(id).orElse(null); }
    public void deleteUser(Long id) { userRepository.deleteById(id); }

    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

    // 👉 NAYA: OTP Generate aur Email send karne ka code
    public String sendOtp(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return "User not found";
        }

        // 4 digit ka OTP banana
        String otp = String.format("%04d", new Random().nextInt(10000));
        otpStorage.put(email, otp); // OTP memory me save kiya

        // Email bhejna
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Apno Rajasthan - Password Reset OTP");
        message.setText("नमस्ते " + user.getName() + ",\n\nआपका पासवर्ड रीसेट करने का OTP है: " + otp + "\n\nकृपया इसे किसी के साथ शेयर न करें।");
        
        mailSender.send(message);
        return "Success";
    }

    // 👉 NAYA: OTP Check karke naya password save karna
    public String verifyOtpAndResetPassword(String email, String otp, String newPassword) {
        if (otpStorage.containsKey(email) && otpStorage.get(email).equals(otp)) {
            User user = userRepository.findByEmail(email);
            user.setPassword(newPassword); // Naya password set kiya
            userRepository.save(user); // Database me save kiya
            
            otpStorage.remove(email); // OTP delete kar diya taaki dobara use na ho
            return "Success";
        }
        return "Invalid OTP";
    }
}