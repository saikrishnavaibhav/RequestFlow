package com.requestflow.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.requestflow.service.RequestFlowService;

@RestController
public class RequestFlowRestController {
	
	@Autowired
	RequestFlowService requestFlowService;
	
	@PostMapping("/submitFileForApproval") 
	public ResponseEntity<?> handleFileUpload( @RequestParam("file") MultipartFile file ) {
		
		
		
		return requestFlowService.submitRequestForApproval(file);
	}

}
