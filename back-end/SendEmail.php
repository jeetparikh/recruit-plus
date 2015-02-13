<?php

class SendEmail
{
    function sendEmailToCandidate($to, $subject, $body, $from = 'hiringteam@inknowledge.com') {

        $headers =  'From: ' . $from . "\r\n" .
                    'Reply-To: ' . $from . "\r\n";

        return mail($to, $subject, $body, $headers);
    }
}