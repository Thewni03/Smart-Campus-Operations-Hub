package com.SmartCampus.SmartCampus.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class MaxAttachmentsException extends RuntimeException {
    public MaxAttachmentsException() {
        super("Maximum of 3 attachments allowed per ticket");
    }
}