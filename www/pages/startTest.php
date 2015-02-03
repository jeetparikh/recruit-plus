<?php
require_once("TestDetails.php");
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $candidate = $_POST["candidateName"];
    $interviewee = $_POST["interviewee"];
    $email = $_POST["email"];
    $position = $_POST["position"];
    $dbInstance = new mysqli('localhost','root','root','recruit');
    mysqli_query($dbInstance,"INSERT INTO candidate(name,email,interviewee,position) VALUES ('$candidate', '$email', '$interviewee', '$position')");
    mysqli_close($dbInstance);
    header("location:Test.html");
}
