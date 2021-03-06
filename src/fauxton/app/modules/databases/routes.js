// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy of
// the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations under
// the License.

define([
  "app",

  "api",

  // Modules
  "modules/databases/resources"
],

function(app, FauxtonAPI, Databases) {
  var allDbsCallback = function() {
    var data = {
      databases: new Databases.List()
    };
    var deferred = FauxtonAPI.Deferred();

    return {
      layout: "with_sidebar",

      data: data,

      crumbs: [
        {"name": "Databases", "link": "/_all_dbs"}
      ],

      views: {
        "#dashboard-content": new Databases.Views.List({
          collection: data.databases
        }),

        "#sidebar-content": new Databases.Views.Sidebar({
          collection: data.databases
        })
      },

      apiUrl: data.databases.url(),

      establish: function() {
        data.databases.fetch().done(function(resp) {
          $.when.apply(null, data.databases.map(function(database) {
            return database.status.fetch();
          })).done(function(resp) {
            deferred.resolve();
          });
        });
        return [deferred];
      }
    };
  };

  Databases.Routes = {
    "": allDbsCallback,
    "index.html": allDbsCallback,
    "_all_dbs(:params)": allDbsCallback
  };

  return Databases;
});
