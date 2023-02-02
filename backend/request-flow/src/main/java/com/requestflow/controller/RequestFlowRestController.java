package com.requestflow.controller;

import java.io.IOException;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.requestflow.requests.LoginRequest;
import com.requestflow.requests.SignupRequest;
import com.requestflow.requests.UserRequest;
import com.requestflow.responses.LoginResponse;
import com.requestflow.service.RequestFlowService;


@RestController
@CrossOrigin(origins = "*" , maxAge = 3600)
@RequestMapping("/api")
public class RequestFlowRestController {
	
	@Autowired
	RequestFlowService requestFlowService;
	
	@PostMapping("/signup")
	public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest signupRequest){
		
		
		return requestFlowService.signupUser(signupRequest);
		
	}
	
	@PostMapping("/sign-in")
	public ResponseEntity<LoginResponse> authenticateUser(@RequestBody LoginRequest loginRequest) {

		return requestFlowService.signin(loginRequest);
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
	
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/retrieveUsers")
	public ResponseEntity<?> retrieveUsers(@RequestParam("userId") long userId){
		return requestFlowService.retrieveUsers(userId);
	}
	
	@PreAuthorize("hasRole('ADMIN') OR hasRole('APPROVER') OR hasRole('REQUESTOR')")
	@GetMapping("/retrieveLogs")
	public ResponseEntity<?> retrieveLogs(){
		return requestFlowService.retrieveLogs();
	}
	
	@PreAuthorize("hasRole('ADMIN')")
	@DeleteMapping("/deleteUser")
	public ResponseEntity<?> deleteUser(@RequestParam("userId") long userId){
		return requestFlowService.deleteUser(userId);
	}
	
	@PreAuthorize("hasRole('ADMIN')")
	@PutMapping("/updateUser")
	public ResponseEntity<?> updateUser(@RequestBody UserRequest userRequest){
		return requestFlowService.updateUser(userRequest);
	}
	
	

}
