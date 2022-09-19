import Notify from "@wcjiang/notify"

const notify = new Notify({
    message: "There is message.", // page title.
    effect: "flash", // flash | scroll, Flashing or scrolling
    onclick: () => {
        // Click on the pop-up window trip event
        // Programmatically closes a notification.
        notify.close();
    },
    // Optional playback sound
    audio: {
        // You can use arrays to pass sound files in multiple formats.
        file: ["src/assets/mp4/bone.mp3"],
    },
    // Title flashing, or scrolling speed
    interval: 1000,
    disableFavicon: false, // Optional, default false, if true, No longer overwrites the original favicon
    // Optional, default green background white text. Favicon
    updateFavicon: {
        // favicon font color
        textColor: "#fff",
        // Background color, set the background color to be transparent, set the value to "transparent"
        backgroundColor: "#2F9A00",
    },
    // Optional chrome browser notifications，
    // The default is not to fill in the following content
    notification: {
        title: "Notification!", // Set notification title
        icon: "", // Set notification icon, The default is Favicon
        body: "You have a new message!", // Set message content
    },
});

export default notify