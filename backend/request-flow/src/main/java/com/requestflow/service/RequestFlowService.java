package com.requestflow.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.requestflow.entities.ApprovalEntity;
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
		if("approver".equals(signupRequest.getRole()))
			userEntity.setRole(RolesEnum.APPROVER);
		else if("admin".equals(signupRequest.getRole()))
			userEntity.setRole(RolesEnum.ADMIN);
		else
			userEntity.setRole(RolesEnum.REQUESTOR);
		
		userRepository.save(userEntity);
		
		return ResponseEntity.accepted().build();
	}

	public ResponseEntity<?> assignRequest(Long userId, Long requestId) {
		Optional<UserEntity> optionalUserEntity = userRepository.findById(userId);
		UserEntity userEntity = optionalUserEntity.get(); 
		RequestEntity requestEntity = requestRepository.findByRequestId(requestId);
		ApprovalEntity approvalEntity = new ApprovalEntity();
		
		approvalEntity.setApprover(userEntity.getFirstName() + ", " + userEntity.getLastName());
		approvalEntity.setApproverId(userEntity.getId());
		approvalEntity.setRequestId(requestId);
		approvalEntity.setStatus(ApprovalEnum.INPROGRESS);
		
		List<ApprovalEntity> approvals = new ArrayList<>();
		approvals.add(approvalEntity);
		
		requestEntity.setApprovals(approvals);
		requestRepository.save(requestEntity);
		return ResponseEntity.ok().build();
	}

	public ResponseEntity<?> viewRequest(Long requestId) {
		RequestEntity requestEntity = requestRepository.findByRequestId(requestId);
		return ResponseEntity.ok(requestEntity);
	}

	//need user id as well and make it approved
	public ResponseEntity<?> approveRequest(Long requestId) {
		RequestEntity requestEntity = requestRepository.findByRequestId(requestId);
		requestEntity.setStatus(ApprovalEnum.APPROVED);
		//List<ApprovalEntity> approvalEntities = requestEntity.getApprovals();
		
		return null;
	}

	public ResponseEntity<?> rejectRequest(Long requestId) {
		// TODO Auto-generated method stub
		return null;
	}
	
	
	
}
