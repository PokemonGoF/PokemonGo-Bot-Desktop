// Inits and sets up materialize things
class Materialize {
    static init() {
        $('#switchPan').change(function() {
            if (this.checked) {
                userInfo.userFollow = true;
            } else {
                userInfo.userFollow = false;
            }
        });

        $('#switchZoom').change(function() {
            if (this.checked) {
                userInfo.userZoom = true;
            } else {
                userInfo.userZoom = false;
            }
        });

        $('#imageType').change(function() {
            if (this.checked) {
                userInfo.imageExt = '.gif';
            } else {
                userInfo.imageExt = '.png';
            }
        });

        $('#strokeOn').change(function() {
            for (var i = 0; i < userInfo.users.length; i++) {
                user.trainerPath.setOptions({
                    strokeOpacity: this.checked ? 1.0 : 0.0
                })
            }
        });

        $('#btn-info').click(function() {
            profileMenu.fillInventory();
        });
        $('select').material_select();
        $('.modal-trigger').leanModal();
        $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false, // Does not change width of dropdown to that of the activator
            hover: true, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: true, // Displays dropdown below the button
            alignment: 'left' // Displays dropdown with edge aligned to the left of button
        });

        $('.tooltipped').tooltip({
            delay: 50
        });
    }
}

module.exports = Materialize;