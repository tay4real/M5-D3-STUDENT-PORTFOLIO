const express = require("express")
const fs = require("fs")
const path = require("path")
const uniqid = require("uniqid")

const { check, validationResult } = require("express-validator")

const router = express.Router()

const readFile = fileName => {
  const buffer = fs.readFileSync(path.join(__dirname, fileName))
  const fileContent = buffer.toString()
  return JSON.parse(fileContent)
}

// GET /projects => returns the list of projects
router.get("/", (req, res, next) => {
    try {
      const projectsDB = readFile("projects.json")
      if (req.query && req.query.name) {
        const filteredprojects = projectsDB.filter(
          project =>
            project.hasOwnProperty("name") &&
            project.name.toLowerCase() === req.query.name.toLowerCase()
        )
        res.send(filteredprojects)
      } else {
        res.send(projectsDB)
      }
    } catch (error) {
      next(error)
    }
})


// GET /projects/id => returns a single project
router.get("/:id", (req, res, next) => {
  try {
    const projectsDB = readFile("projects.json")
    const project = projectsDB.filter(project => project.ID === req.params.id)
    if (project.length > 0) {
      res.send(project)
    } else {
      const err = new Error()
      err.httpStatusCode = 404
      next(err)
    }
  } catch (error) {
    next(error)
  }
})


// POST /projects => create a new project
router.post(
  "/",
  [
    check("name")
      .isLength({ min: 4 })
      .withMessage("No way! Name too short!")
      .exists()
      .withMessage("Insert a name please!"),
  ],
  (req, res, next) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        const err = new Error()
        err.message = errors
        err.httpStatusCode = 400
        next(err)
      } else {
        const projectsDB = readFile("projects.json")
        const newproject = {
          ...req.body,
          ID: uniqid(),
          modifiedAt: new Date(),
        }

        projectsDB.push(newproject)

        fs.writeFileSync(
          path.join(__dirname, "projects.json"),
          JSON.stringify(projectsDB)
        )

        res.status(201).send({ id: newproject.ID })
      }
    } catch (error) {
      next(error)
    }
  }
)

// PUT /projects/id => edit the project with the given id
router.put("/:id", (req, res, next) => {
    try {
      const projectsDB = readFile("projects.json")
      const newDb = projectsDB.filter(project => project.ID !== req.params.id)
  
      const modifiedproject = {
        ...req.body,
        ID: req.params.id,
        modifiedAt: new Date(),
      }
  
      newDb.push(modifiedproject)
      fs.writeFileSync(path.join(__dirname, "projects.json"), JSON.stringify(newDb))
  
      res.send({ id: modifiedproject.ID })
    } catch (error) {
      next(error)
    }
  })


//DELETE /projects/id => delete the project with the given id
router.delete("/:id", (req, res, next) => {
    try {
      const projectsDB = readFile("projects.json")
      const newDb = projectsDB.filter(project => project.ID !== req.params.id)
      fs.writeFileSync(path.join(__dirname, "projects.json"), JSON.stringify(newDb))
  
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  })


module.exports = router
