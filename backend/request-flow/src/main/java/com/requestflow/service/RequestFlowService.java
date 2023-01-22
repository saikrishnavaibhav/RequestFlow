package com.requestflow.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.requestflow.entities.ApprovalEntity;
import com.requestflow.entities.RequestEntity;
import com.requestflow.entities.Role;
import com.requestflow.entities.UserEntity;
import com.requestflow.repositories.RequestRepository;
import com.requestflow.repositories.RoleRepository;
import com.requestflow.repositories.UserRepository;
import com.requestflow.requests.SignupRequest;
import com.requestflow.responses.MessageResponse;
import com.requestflow.utils.ApprovalEnum;
import com.requestflow.utils.Roles;
import com.requestflow.utils.UserUtils;

@Service
public class RequestFlowService {

	@Autowired
	RequestRepository requestRepository;
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	RoleRepository roleRepository;
	
	@Autowired
	PasswordEncoder encoder;
	
	public ResponseEntity<?> submitRequestForApproval(MultipartFile file) throws IOException {
		
		RequestEntity requestEntity = new RequestEntity();
		
		requestEntity.setDate();
		requestEntity.setFile(file.getBytes());
		requestEntity.setStatus(ApprovalEnum.INITIATED);
//		ApprovalEntity approvalEntity = new ApprovalEntity();
//		
//		approvalEntity.setApprover(userEntity.getFirstName() + ", " + userEntity.getLastName());
//		approvalEntity.setApproverId(userEntity.getId());
//		approvalEntity.setRequestId(requestId);
//		approvalEntity.setStatus(ApprovalEnum.INPROGRESS);
//		
//		List<ApprovalEntity> approvals = new ArrayList<>();
//		approvals.add(approvalEntity);
//		
//		requestEntity.setApprovals(approvals);
		requestRepository.save(requestEntity);
		
		
		return ResponseEntity.ok().build();
	}

	public ResponseEntity<?> getRequests(long userId) {
		
		return ResponseEntity.ok(requestRepository.findAllByUserId(userId));
	}

	public ResponseEntity<?> signupUser(SignupRequest signupRequest) {
		
		if (Boolean.TRUE.equals(userRepository.existsByUserName(signupRequest.getUserName()))) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse(UserUtils.USERNAME_ALREADY_TAKEN));
		}
		UserEntity userEntity = new UserEntity();
		
		userEntity.setEmailId(signupRequest.getEmailId());
		userEntity.setFirstName(signupRequest.getFirstName());
		userEntity.setLastName(signupRequest.getLastName());
		userEntity.setPassword(encoder.encode(signupRequest.getPassword()));
		userEntity.setUserName(signupRequest.getUserName());
		
		Set<Role> roles = new HashSet<>();
		List<String> strRoles = signupRequest.getRoles(); 
		
		if (strRoles == null) {
			Role userRole = roleRepository.findByRole(Roles.ROLE_REQUESTOR)
					.orElseThrow(() -> new RuntimeException(UserUtils.ROLE_NOT_FOUND));
			roles.add(userRole);
		} else {
			strRoles.forEach(role -> {
				if("approver".equalsIgnoreCase(role)) {
					Role authorRole = roleRepository.findByRole(Roles.ROLE_APPROVER)
							.orElseThrow(() -> new RuntimeException(UserUtils.ROLE_NOT_FOUND));
					roles.add(authorRole);
				} else {
					Role userRole = roleRepository.findByRole(Roles.ROLE_REQUESTOR)
							.orElseThrow(() -> new RuntimeException(UserUtils.ROLE_NOT_FOUND));
					roles.add(userRole);
				}
			});
		}

		userEntity.setRoles(roles);
		
		userRepository.save(userEntity);
		
		return ResponseEntity.ok().build();
	}

	public ResponseEntity<?> assignRequest(Long userId, Long requestId) throws Exception {
		Optional<UserEntity> optionalUserEntity = userRepository.findById(userId);
		UserEntity userEntity = optionalUserEntity.get(); 
		RequestEntity requestEntity = requestRepository.findById(requestId).orElseThrow(()-> new Exception("Invalid Request"));
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

	public ResponseEntity<?> viewRequest(Long requestId) throws Exception {
		RequestEntity requestEntity = requestRepository.findById(requestId).orElseThrow(()-> new Exception("Invalid Request"));
		return ResponseEntity.ok(requestEntity);
	}

	public ResponseEntity<?> approveRequest(Long requestId, long userId, boolean approve) throws Exception {
		RequestEntity requestEntity = requestRepository.findById(requestId).orElseThrow(()-> new Exception("Invalid Request"));
		if(approve)
			requestEntity.setStatus(ApprovalEnum.APPROVED);
		else
			requestEntity.setStatus(ApprovalEnum.REJECTED);
		
		List<ApprovalEntity> approvalEntities = requestEntity.getApprovals();
		approvalEntities.stream().forEach(ae -> {
			if(ae.getApproverId() == userId) {
				if(approve)
					ae.setStatus(ApprovalEnum.APPROVED);
				else
					ae.setStatus(ApprovalEnum.REJECTED);
			}
		});
		requestEntity.setApprovals(approvalEntities);
		requestRepository.save(requestEntity);
		
		return ResponseEntity.ok(requestEntity);
	}

//	public ResponseEntity<?> rejectRequest(Long requestId) {
//		// TODO Auto-generated method stub
//		return null;
//	}
	
	
	
}
