/**
 * Drafts
 *    _id
 *    title               String 1..100
 *    content             String 1..
 *    user                Object  { _id, username, name }
 *    createdAt           Date
 *    updatedAt           Date
 *
 * @type {Mongo.Collection}
 */
Drafts = new Mongo.Collection('drafts');
// GroundBlogs = new Ground.Collection(Drafts);

Meteor.methods({

  draftAutosave: function(object) {
    check(object, Match.Where(matchDraftInsert));

    // check permission
    if (! this.userId)
      throw new Meteor.Error(ERROR_CODE_SECURITY, "error_access_denied");

    // set input object
    var now = new Date();
    var user = Meteor.user();

    var data = {
      title: object.title,
      content: object.content,
      user: {
        _id: user._id,
        username: user.username,
        name: user.name
      },
      createdAt: now,
      updatedAt: now
    };

    // write to database
    data = Drafts.insert(data);

    return data;
  },


  draftAutoupdate: function(draftId, object) {
    check(draftId, String);
    check(object, Match.Where(matchDraftUpdate));

    // check permission
    if (! this.userId)
      throw new Meteor.Error(403, "error_access_denied");
    var draft = Drafts.findOne({ _id: draftId });

    if ( draft.user._id != this.userId ) {
      return false;
    }

    // make input object
    var now = new Date();
    var data = {
      title: object.title,
      content: object.content,
      updatedAt: now
    };

    // update the database
    var updated = Drafts.update({ _id: draftId, 'user._id': this.userId }, { $set: data });
    return updated;
  },


  draftRemove: function(draftId) {

    // check permission
    if (! this.userId)
      throw new Meteor.Error(403, "error_access_denied");

    // remove the blog
    var removed = Drafts.remove({ _id: draftId, 'user._id': this.userId });
    return removed;
  }

});
