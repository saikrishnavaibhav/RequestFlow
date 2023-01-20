package com.requestflow.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.requestflow.requests.SignupRequest;
import com.requestflow.service.RequestFlowService;

@RestController
@CrossOrigin(origins = "*" , maxAge = 3600)
@RequestMapping("/api")
public class RequestFlowRestController {
	
	@Autowired
	RequestFlowService requestFlowService;
	
	@PostMapping("/signup")
	public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest){
		
		return requestFlowService.signupUser(signupRequest);
		
	}
	
	@PostMapping("/submitFileForApproval") 
	public ResponseEntity<?> submitFileForApproval( @RequestParam("file") MultipartFile file ) throws IOException {
		
		return requestFlowService.submitRequestForApproval(file);
	}
	
	@GetMapping("/getRequests/{userId}")
	public ResponseEntity<?> getRequests(@PathVariable("userId") long userId) throws IOException {
		
		return requestFlowService.getRequests(userId);
	}

}
