# sse-node


In Angular how to consume SSE ? 

## Create a service file in that file add the below function

  getServerSentEvent(url: string): Observable<any> {
    return new Observable(observer => {
      const eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        observer.next(event.data);
      };

      eventSource.onerror = (error) => {
        observer.error(error);
      };

      return () => {
        eventSource.close();
      };
    });
  }

## Component file
    Add the state variables

    messages: string[] = [];
    subscription: Subscription;
   
   Inside constructor or onInit subscribe for the event

     this.subscription = this.sseService.getServerSentEvent('http://localhost:3000/events')
    .subscribe((data: string) => {
    console.log('event', data);
      this.messages.push(data);
    });


