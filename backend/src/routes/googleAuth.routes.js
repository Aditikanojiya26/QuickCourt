import { Router } from "express";
import passport from "passport";

const router = Router();

// CORRECTION: Use the correct path for the login route
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// CORRECTION: Use the correct path for the callback route
    router.get('/google/callback', (req, res, next) => {
        passport.authenticate('google', (err, user, info) => {
            if (err || !user) {
                // Handle errors
                return res.redirect("http://localhost:5173/login?error=auth_failed");
            }
            
            // ... (existing token generation logic remains the same)
            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();
            
            const options = {
                httpOnly: true,
                secure: true
            };

            res.cookie('accessToken', accessToken, options);
            res.cookie('refreshToken', refreshToken, options);
            
            // CORRECTION: Redirect back to your frontend on the correct port
            res.redirect("http://localhost:5173");

        })(req, res, next);
    });

export default router;
