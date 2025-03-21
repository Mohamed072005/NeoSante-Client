import {create} from "zustand/react";
import {createJSONStorage, persist} from "zustand/middleware";
import {jwtDecode} from "jwt-decode";
import {withLocalStorage} from "@/lib/utils/localStorage";
import {Token} from "@/lib/types/localStorage";
import {AuthState, JWTPayload} from "@/lib/types/auth";

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: true,
            checkAuth: async () => {
                try{
                    set({ isLoading: true });
                    const tokenLocalStorage = withLocalStorage<Token>("token");
                    const token = tokenLocalStorage.get();
                    if(!token) {
                        set({isAuthenticated: false, user: null, isLoading: false});
                        return;
                    }

                    const decodedToken = jwtDecode<JWTPayload>(token.data);
                    const currentDate = Date.now() / 1000;
                    if(decodedToken.exp < currentDate) {
                        tokenLocalStorage.remove();
                        set({isAuthenticated: false, user: null, isLoading: false});
                        return;
                    }
                    set({
                        isAuthenticated: true,
                        isLoading: false,
                        user: {
                            user_id: decodedToken.user_id,
                            role: decodedToken.user_role,
                            permissions: decodedToken.user_permissions
                        }})
                }catch(err: unknown){
                    console.log(err);
                    set({isAuthenticated: false, user: null, isLoading: false});
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ user: state.user }),
        }
    )
)

export default useAuthStore;