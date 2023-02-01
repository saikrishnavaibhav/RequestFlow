package com.requestflow.service;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.requestflow.entities.ApprovalEntity;
import com.requestflow.entities.LogEntity;
import com.requestflow.entities.NotificationEntity;
import com.requestflow.entities.RequestEntity;
import com.requestflow.entities.Role;
import com.requestflow.entities.UserEntity;
import com.requestflow.jwt.JwtUtils;
import com.requestflow.repositories.LogsRepository;
import com.requestflow.repositories.NotificationsRepository;
import com.requestflow.repositories.RequestRepository;
import com.requestflow.repositories.RoleRepository;
import com.requestflow.repositories.UserRepository;
import com.requestflow.requests.LoginRequest;
import com.requestflow.requests.SignupRequest;
import com.requestflow.responses.LoginResponse;
import com.requestflow.responses.MessageResponse;
import com.requestflow.responses.RequestResponse;
import com.requestflow.userdetails.UserDetailsImpl;
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
	NotificationsRepository notificationsRepository;
	
	@Autowired
	LogsRepository logsRepository;
	
	@Autowired
	PasswordEncoder encoder;
	
	@Autowired
	JwtUtils jwtUtils;
	
	@Autowired
	AuthenticationManager authenticationManager;
	
	private static final Logger logger = LoggerFactory.getLogger(RequestFlowService.class);
	
	public ResponseEntity<?> submitRequestForApproval(MultipartFile file, long userId) throws IOException {
		
		RequestEntity requestEntity = new RequestEntity();
		System.out.println(file);
		requestEntity.setDate();
		requestEntity.setFile(file.getBytes());
		requestEntity.setStatus(ApprovalEnum.INITIATED);
		requestEntity.setUserId(userId);
		requestEntity.setFileName(file.getOriginalFilename());
		System.out.println(requestEntity);
		requestEntity = requestRepository.save(requestEntity);
		logMessage("Request "+requestEntity.getId() + " created");
		return ResponseEntity.ok().build();
	}

	public ResponseEntity<?> getRequests() {
		List<RequestResponse> requestResponses  = new ArrayList<>();
		requestRepository.findAll()
		.forEach(re -> requestResponses.add(getRequestResponse(re)));
		return ResponseEntity.ok(requestResponses);
	}
	
	public ResponseEntity<?> getRequestsOfUser(long userId) {
		List<RequestResponse> requestResponses  = new ArrayList<>();
		requestRepository.findAllByUserId(userId).stream()
		.forEach(re -> requestResponses.add(getRequestResponse(re)));
		logger.info("requests: " + requestResponses);
		return ResponseEntity.ok(requestResponses);
	}
	
	private RequestResponse getRequestResponse(RequestEntity re) {
		RequestResponse requestResponse = new RequestResponse();
		requestResponse.setId(re.getId());
		requestResponse.setDate(re.getDate().toLocalDateTime().toLocalDate().toString());
		InputStream is = new ByteArrayInputStream(re.getFile());
		List<String> stringFromBytes = streamToString(is, StandardCharsets.UTF_8);
		
		requestResponse.setFile(stringFromBytes);
		requestResponse.setFileName(re.getFileName());
		requestResponse.setStatus(re.getStatus());
		requestResponse.setApprovals(re.getApprovals());
		requestResponse.setUserId(re.getUserId());
		return requestResponse;
}
	
	public List<String> streamToString(InputStream is, Charset encoding) {
		BufferedReader br = new BufferedReader(new InputStreamReader(is, encoding));
		List<String> data = new ArrayList<>();
		try {
			String line = br.readLine();
			while (line != null) {
				data.add(line);
				line = br.readLine();
			}
		} catch (IOException io) {
			System.out.println("Failed to read from Stream");
			io.printStackTrace();
		} finally {
			try {
				br.close();
			} catch (IOException ioex) {
				System.out.println("Failed to close Streams");
				ioex.printStackTrace();
			}
		}
		return data;
	}
	
	public ResponseEntity<LoginResponse> signin(LoginRequest loginRequest) {
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUserName(), loginRequest.getPassword()));

		
		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtils.generateJwtToken(authentication);
		
		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();		
		List<String> roles = userDetails.getAuthorities().stream()
				.map(GrantedAuthority::getAuthority)
				.collect(Collectors.toList());
		logMessage("user "+ userDetails.getUsername() +" last logged in at "+LocalDateTime.now());
		return ResponseEntity.ok(new LoginResponse(jwt, 
												 userDetails.getId(), 
												 userDetails.getUsername(), 
												 userDetails.getFirstName(),
												 userDetails.getLastName(),
												 userDetails.getEmail(),
												 roles));
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
		String role =  signupRequest.getRole();
		
		if (role == null) {
			Role userRole = roleRepository.findByRole(Roles.ROLE_REQUESTOR)
					.orElseThrow(() -> new RuntimeException(UserUtils.ROLE_NOT_FOUND));
			roles.add(userRole);
		} else if ("ROLE_APPROVER".equalsIgnoreCase(role)) {
			Role authorRole = roleRepository.findByRole(Roles.ROLE_APPROVER)
					.orElseThrow(() -> new RuntimeException(UserUtils.ROLE_NOT_FOUND));
			roles.add(authorRole);
		} else if ("ROLE_REQUESTOR".equalsIgnoreCase(role)) {
			Role userRole = roleRepository.findByRole(Roles.ROLE_REQUESTOR)
					.orElseThrow(() -> new RuntimeException(UserUtils.ROLE_NOT_FOUND));
			roles.add(userRole);
		} else {
			Role userRole = roleRepository.findByRole(Roles.ROLE_ADMIN)
					.orElseThrow(() -> new RuntimeException(UserUtils.ROLE_NOT_FOUND));
			roles.add(userRole);
		}

		userEntity.setRoles(roles);
		
		userRepository.save(userEntity);
		logMessage("New user created successfully with username: "+userEntity.getUserName());
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
		
		requestEntity.setStatus(ApprovalEnum.INPROGRESS);
		requestEntity.setApprovals(approvals);
		requestEntity = requestRepository.save(requestEntity);
		logMessage("request " + requestEntity.getId() + " got assigned to an approver");
		ApprovalEntity savedApprovalEntity = requestEntity.getApprovals().stream().filter(re -> re.getRequestId() == approvalEntity.getRequestId()).findFirst().orElse(null);
		if(savedApprovalEntity != null)
			return ResponseEntity.ok(savedApprovalEntity);
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
		logger.info("Request with id "+requestEntity.getId()+" got "+ requestEntity.getStatus().name());
		logMessage("Request with id "+requestEntity.getId()+" got "+ requestEntity.getStatus().name());
		addNotificationToUser(requestEntity.getUserId(), requestId,requestEntity.getStatus().name().toString());
		
		return ResponseEntity.ok(requestEntity);
	}

	private void addNotificationToUser(long userId, Long requestId, String status) {
		NotificationEntity notification = new NotificationEntity();
		notification.setRequestId(requestId);
		notification.setUserId(userId);
		notification.setStatus(status);
		notification.setRead(false);
		
		notificationsRepository.save(notification);
		logger.info("notified user:"+ userId );
		logMessage("Notified user: "+ userId + " on request " + status);
		
	}

	public ResponseEntity<?> retrieveNotifications(long userId) {
		List<NotificationEntity> notifications = notificationsRepository.findAllByUserId(userId);
		logger.info("retrieved notifications: " + notifications.size());
		return ResponseEntity.ok(notifications);
	}

	public ResponseEntity<?> readNotification(long notificationId) {
		NotificationEntity notificationEntity = notificationsRepository.findById(notificationId).orElse(null);
		if(notificationEntity == null) {
			return ResponseEntity.badRequest().build();
		}
		notificationEntity.setRead(true);
		notificationsRepository.save(notificationEntity);
		logMessage("notification "+ notificationId + " marked as read "+LocalDateTime.now());
		return ResponseEntity.ok().build();
	}

	public ResponseEntity<?> retrieveUsers(long userId) {
		return ResponseEntity.ok(userRepository.findAll());
	}

	public ResponseEntity<?> retrieveLogs() {
		return ResponseEntity.ok(logsRepository.findAll());
	}
	
	public void logMessage(String message) {
		logger.info(message);
		LogEntity logEntity = new LogEntity();
		logEntity.setLog(message);
		logsRepository.save(logEntity);
	}
	
}
