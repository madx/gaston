/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "dt0wy8ygja4bub9",
    "created": "2024-05-23 13:20:04.593Z",
    "updated": "2024-05-23 13:20:04.593Z",
    "name": "namedChannels",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "aogwob9g",
        "name": "channelId",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "bfouhkbl",
        "name": "channelName",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_JtMKUgr` ON `namedChannels` (`channelId`)",
      "CREATE UNIQUE INDEX `idx_je9raD0` ON `namedChannels` (`channelName`)"
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("dt0wy8ygja4bub9");

  return dao.deleteCollection(collection);
})
