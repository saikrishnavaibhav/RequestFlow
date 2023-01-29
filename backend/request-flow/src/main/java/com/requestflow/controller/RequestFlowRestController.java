package com.requestflow.controller;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.requestflow.jwt.JwtUtils;
import com.requestflow.requests.LoginRequest;
import com.requestflow.requests.SignupRequest;
import com.requestflow.responses.LoginResponse;
import com.requestflow.service.RequestFlowService;
import com.requestflow.userdetails.UserDetailsImpl;


@RestController
@CrossOrigin(origins = "*" , maxAge = 3600)
@RequestMapping("/api")
public class RequestFlowRestController {
	
	@Autowired
	RequestFlowService requestFlowService;
	
	@Autowired
	JwtUtils jwtUtils;
	
	@Autowired
	AuthenticationManager authenticationManager;
	
	@PostMapping("/signup")
	public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest signupRequest){
		
		
		return requestFlowService.signupUser(signupRequest);
		
	}
	
	@PostMapping("/sign-in")
	public ResponseEntity<LoginResponse> authenticateUser(@RequestBody LoginRequest loginRequest) {

		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUserName(), loginRequest.getPassword()));

		
		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtils.generateJwtToken(authentication);
		
		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();		
		List<String> roles = userDetails.getAuthorities().stream()
				.map(GrantedAuthority::getAuthority)
				.collect(Collectors.toList());
		
		return ResponseEntity.ok(new LoginResponse(jwt, 
												 userDetails.getId(), 
												 userDetails.getUsername(), 
												 userDetails.getFirstName(),
												 userDetails.getLastName(),
												 userDetails.getEmail(),
												 roles));
	}
	
	@PreAuthorize("hasAuthority('ROLE_REQUESTOR')")
	@PostMapping("/submitFileForApproval") 
	public ResponseEntity<?> submitFileForApproval( @RequestParam("file") MultipartFile file, @RequestParam("userId") long userId) throws IOException {
		
		return requestFlowService.submitRequestForApproval(file,userId);
	}
	
	@PreAuthorize("hasAuthority('ROLE_REQUESTOR') OR hasAuthority('ROLE_APPROVER') OR hasAuthority('ROLE_ADMIN')")
	@GetMapping("/getRequests")
	public ResponseEntity<?> getRequests(@RequestParam("userId") long userId) throws IOException {
		
		return requestFlowService.getRequestsOfUser(userId);
	}
	
	@PreAuthorize("hasAuthority('ROLE_APPROVER') OR hasAuthority('ROLE_ADMIN')")
	@GetMapping("/getAllRequests")
	public ResponseEntity<?> getAllRequests() throws IOException {
		
		return requestFlowService.getRequests();
	}
	
	@PreAuthorize("hasAuthority('ROLE_APPROVER') OR hasAuthority('ROLE_ADMIN')")
	@PostMapping("/assignRequest")
	public ResponseEntity<?> assignRequestToApprover(@RequestParam("userId") Long userId, @RequestParam("requestId") Long requestId) throws Exception{
		
		return requestFlowService.assignRequest(userId,requestId);
	}
	
	@PreAuthorize("hasRole('REQUESTOR') OR hasRole('APPROVER') OR hasRole('ADMIN')")
	@GetMapping("/viewRequest")
	public ResponseEntity<?> viewRequest(@RequestParam("requestId") Long requestId) throws Exception{
		return requestFlowService.viewRequest(requestId);
	}
	
	@PreAuthorize("hasRole('APPROVER') OR hasRole('ADMIN')")
	@PostMapping("/approveRequest")
	public ResponseEntity<?> approveRequest(@RequestParam("requestId") Long requestId, @RequestParam("userId") long userId, @RequestParam("approve") boolean approve) throws Exception{
		return requestFlowService.approveRequest(requestId, userId, approve);
	}
	
	@PreAuthorize("hasRole('REQUESTOR')")
	@GetMapping("/retrieveNotifications")
	public ResponseEntity<?> retrieveNotifications(@RequestParam("userId") long userId){
		return requestFlowService.retrieveNotifications(userId);
	}
	
	@PreAuthorize("hasRole('REQUESTOR')")
	@PutMapping("/readNotification")
	public ResponseEntity<?> readNotification(@RequestParam("notificationId") long notificationId){
		return requestFlowService.readNotification(notificationId);
	}
	
	
	
//	@PostMapping("/reject")
//	public ResponseEntity<?> rejectRequest(@RequestParam("requestId") Long requestId, @RequestParam("userId") long userId){
//		return requestFlowService.rejectRequest(requestId);
//	}
	

}
