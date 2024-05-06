const express=require('express')
const router=express.Router();
const catchAsync=require('../utils/catchAsync')
const {validateEntry,isAuthorisedEntry,loggedIn}=require('../middleware')
const entries=require('../controllers/entries')

router.route('/')
    .get(loggedIn,catchAsync(entries.index))
    .post(loggedIn,validateEntry,catchAsync(entries.createEntry))


router.route('/:id')
    .put(loggedIn,isAuthorisedEntry,validateEntry,catchAsync(entries.editEntry))
    .delete(loggedIn,isAuthorisedEntry,catchAsync(entries.deleteEntry))

router.get('/:id/edit',loggedIn,isAuthorisedEntry,catchAsync(entries.renderEditForm))

module.exports=router