

class EmailBackend:
    def send_messages(self, email_messages):
        for message in email_messages:
            print("Email from:", message.sender)
            print(message.subject)
        return len(email_messages)