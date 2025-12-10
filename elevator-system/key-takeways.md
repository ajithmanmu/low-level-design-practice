--------
How does your design follow SRP?

We are defining multiple classes which have different responsibilities. Elevator - encapsualtes all the info related to Elevator and in future if we need to change the elevator behaviour we only need to change this class. Same for ElevatorSystem and Request classes. 

I separated requests into their own classes - ExternalRequest for hall calls and InternalRequest for cab calls. Each class has a single
  responsibility: holding and validating its specific request data.

  This means if requirements change - like adding priority to internal requests or timestamps to external requests - I only modify one class. The
  ElevatorSystem doesn't need to change because it works with the Request interface, not the concrete implementations.

  This also makes testing easier - I can unit test each request type independently."
  
--------




