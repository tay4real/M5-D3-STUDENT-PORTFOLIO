/*

1. GET /students => returns the list of students
2. GET /students/123 => returns a single student
3. POST /students => create a new student
4. PUT /students/123 => edit the student with the given id
5. DELETE /students/123 => delete the student with the given id

All the routes in this file will have the /student prefix
*/

const express = require("express") // third module party
const fs = require("fs") // core module
const path = require("path") // core module
const uniqid = require("uniqid")

const router = express.Router()

// 1. GET /students => returns the list of students
router.get("/", (req, res) => { // handler 
    const studentsFilePath = path.join(__dirname, "students.json")
    const fileAsABuffer = fs.readFileSync(studentsFilePath)
    const fileAsString = fileAsABuffer.toString()
    const studentsArray = JSON.parse(fileAsString)
    res.send(studentsArray)
})

//2.  GET /students/123 => returns a single student
router.get("/:id", (req, res) => { // handler
    const studentsFilePath = path.join(__dirname, "students.json")
    const fileAsABuffer = fs.readFileSync(studentsFilePath)
    const fileAsString = fileAsABuffer.toString()
    const studentsArray = JSON.parse(fileAsString)

    const idComingFromRequest = req.params.id
    const student = studentsArray.filter(student => student.id === idComingFromRequest)

    res.send(student)
})

// 3. POST /students => create a new student
router.post("/", (req, res) => { // handler
    const studentsFilePath = path.join(__dirname, "students.json")
    const fileAsABuffer = fs.readFileSync(studentsFilePath)
    const fileAsString = fileAsABuffer.toString()
    const studentsArray = JSON.parse(fileAsString)

    // push new student to studentsArray
    const newStudent = req.body

    // create unique identifier
    newStudent.id = uniqid()
    console.log(newStudent)
    studentsArray.push(newStudent)
    console.log(studentsArray)

    // replace old content in the file with new array
    fs.writeFileSync(studentsFilePath, JSON.stringify(studentsArray))
    res.status(201).send("New student created successfully!")
    
})

// 4. PUT /students/123 => edit the student with the given id
router.put("/:id", (req, res) => { // handler
    // Read the file
    const studentsFilePath = path.join(__dirname, "students.json")
    const fileAsABuffer = fs.readFileSync(studentsFilePath)
    const fileAsString = fileAsABuffer.toString()
    const studentsArray = JSON.parse(fileAsString)

   // filter out the student with the specified id
   const newStudentsArray = studentsArray.filter(student => student.id !== req.params.id)

    // Add the modified student back to the array
    const modifiedStudent = req.body
    modifiedStudent.id = req.params.id

    newStudentsArray.push(modifiedStudent)

    // replace old content in the file with new array
    fs.writeFileSync(studentsFilePath, JSON.stringify(newStudentsArray))
    res.status(201).send("Student updated successfully!")
})

// 5. DELETE /students/123 => delete the student with the given id
router.delete("/:id", (req, res) => { // handler
    // Read the file
    const studentsFilePath = path.join(__dirname, "students.json")
    const fileAsABuffer = fs.readFileSync(studentsFilePath)
    const fileAsString = fileAsABuffer.toString()
    const studentsArray = JSON.parse(fileAsString)

    // filter out the student with the specified id
    const newStudentsArray = studentsArray.filter(student => student.id !== req.params.id)

    // Save it back to disk
    fs.writeFileSync(studentsFilePath, JSON.stringify(newStudentsArray))

    res.status(204).send()

})
module.exports = router