'use strict'

/*
|--------------------------------------------------------------------------
| PermissionSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

/* Role And Permission Classes Extend Model Class */ 
const Role = use('Adonis/Acl/Role')
const Permission = use('Adonis/Acl/Permission')


class PermissionSeeder {
  async run () {

  }
}

module.exports = PermissionSeeder
