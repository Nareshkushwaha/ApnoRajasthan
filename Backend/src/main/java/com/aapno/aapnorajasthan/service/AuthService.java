//package com.aapno.aapnorajasthan.service;
//
//import com.aapno.aapnorajasthan.dto.SignupRequest;
//import com.aapno.aapnorajasthan.entity.Reader;
//import com.aapno.aapnorajasthan.repository.ReaderRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//@Service
//public class AuthService {
//
//    @Autowired
//    private ReaderRepository readerRepository;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    public String signupReader(SignupRequest request) {
//        // 1. Check karo ki email pehle se exist karti hai ya nahi
//        if (readerRepository.existsByEmail(request.getEmail())) {
//            return "Error: यह ईमेल पहले से रजिस्टर है!";
//        }
//
//        // 2. Naya Reader banao
//        Reader reader = new Reader();
//        reader.setName(request.getName());
//        reader.setEmail(request.getEmail());
//        
//        // 3. Password ko Encrypt karke set karo
//        reader.setPassword(passwordEncoder.encode(request.getPassword()));
//
//        // 4. Database me save karo
//        readerRepository.save(reader);
//
//        return "Success: आपका खाता सफलतापूर्वक बन गया है!";
//    }
//}