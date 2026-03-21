*I was going to keep the code completely commentted but it got out of hand*
# Version 2
## Goal
    Send a request for correct dates and location PER Course
## How To Implement:
There are **3 main categories** in the `meetingTime` arrays we will use...
1. **Location**
    ```js
    building + room
2. **Dates**
    ```js
    monday: false 
    tuesday: true
    ...   
3. **Time**
    ```js
    endDate, startDate, endTime, beginTime
### BUT There's a BIG Problem Here...
    The New Start Date Is NOT The First Day of that class, it is the first day of the *Semester*
    So we'll need to derive that first Day ourselves (sadly)
### Also...
    We have to restructure our loop to basically loop through the courses like before but each time slot PER course (this also means removing duplicate courses in the first list)

    (I realized this VERY late into the process)

    And we have to be aware of online sections assigned that aren't given a weekday at all
### So Basically...
    In this version, I combined two separate types of data from the MyMarist JS Backend, and yes we do need both, since neither have all of our information
### Misc Notes
* We have to set most of our functions to run async to each other since we are now requesting some additional data outside of intercepting the data that's already loading.
# Version 1
* Gives Classes per Selected Term but does NOT Place at the Correct Date
    * They will always be on the correct **day** but on the current *week*