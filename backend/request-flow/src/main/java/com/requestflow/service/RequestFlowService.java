package com.requestflow.service;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.requestflow.entities.RequestEntity;
import com.requestflow.entities.UserEntity;
import com.requestflow.repositories.RequestRepository;
import com.requestflow.repositories.UserRepository;
import com.requestflow.requests.SignupRequest;
import com.requestflow.utils.ApprovalEnum;
import com.requestflow.utils.RolesEnum;

@Service
public class RequestFlowService {

	@Autowired
	RequestRepository requestRepository;
	
	@Autowired
	UserRepository userRepository;
	
	public ResponseEntity<?> submitRequestForApproval(MultipartFile file) throws IOException {
		
		RequestEntity requestEntity = new RequestEntity();
		
		requestEntity.setDate();
		requestEntity.setFile(file.getBytes());
		requestEntity.setStatus(ApprovalEnum.INITIATED);
		
		requestRepository.save(requestEntity);
		
		
		return ResponseEntity.ok().build();
	}

	public ResponseEntity<?> getRequests(long userId) {
		
		return ResponseEntity.ok(requestRepository.findAllByUserId(userId));
	}

	public ResponseEntity<?> signupUser(SignupRequest signupRequest) {
		
		UserEntity userEntity = new UserEntity();
		
		userEntity.setEmailId(signupRequest.getEmailId());
		userEntity.setFirstName(signupRequest.getFirstName());
		userEntity.setLastName(signupRequest.getLastName());
		userEntity.setPassword(signupRequest.getPassword());
		userEntity.setUserName(signupRequest.getUserName());
		if(signupRequest.getRole().equals("approver"))
			userEntity.setRole(RolesEnum.APPROVER);
		if(signupRequest.getRole().equals("requestor"))
			userEntity.setRole(RolesEnum.REQUESTOR);
		if(signupRequest.getRole().equals("admin"))
			userEntity.setRole(RolesEnum.ADMIN);
		
		userRepository.save(userEntity);
		
		return ResponseEntity.accepted().build();
	}
	
	
	
}
