const HP = { 
    maxHP: 100,
    currentHP: 100,
    barWidth: 330,
    barHeight: 20,
    barX: 20,
    barY: 20,
    barBorderColor: '#000000',
    barBackgroundColor: '#333333',
    barFillColor: '#00cc00',

    takeDamagePercent(percent) {
        const damage = (this.maxHP * percent) / 100;
        this.currentHP = Math.max(this.currentHP - damage, 0);

        if (this.currentHP <= 0) {
            window.location.href = "../pages/DeathScreen.html";
        }
    },

    draw(ctx) {
        ctx.save();

        ctx.fillStyle = this.barBackgroundColor;
        ctx.fillRect(this.barX, this.barY, this.barWidth, this.barHeight);

        const fillWidth = Math.round((this.currentHP / this.maxHP) * this.barWidth);

        ctx.fillStyle = this.currentHP > 0 ? this.barFillColor : '#ff0000';
        ctx.fillRect(this.barX, this.barY, fillWidth, this.barHeight);

        ctx.strokeStyle = this.barBorderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.barX, this.barY, this.barWidth, this.barHeight);

        ctx.restore();
    }
};
