module.exports = {
    name: "Round_Image",

    execute(Context, X_Position, Y_Position, Height, Width, Radius) {
        Context.beginPath();
        Context.moveTo(X_Position + Radius, Y_Position);
        Context.lineTo(X_Position + Width - Radius, Y_Position);
        Context.quadraticCurveTo(X_Position + Width, Y_Position, X_Position + Width, Y_Position + Radius);
        Context.lineTo(X_Position + Width, Y_Position + Height - Radius);
        Context.quadraticCurveTo(X_Position + Width, Y_Position + Height, X_Position + Width - Radius, Y_Position + Height);
        Context.lineTo(X_Position + Radius, Y_Position + Height);
        Context.quadraticCurveTo(X_Position, Y_Position + Height, X_Position, Y_Position + Height - Radius);
        Context.lineTo(X_Position, Y_Position + Radius);
        Context.quadraticCurveTo(X_Position, Y_Position, X_Position + Radius, Y_Position);
        Context.closePath();
    }
};