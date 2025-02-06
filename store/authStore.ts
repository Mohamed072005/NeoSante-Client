import {create} from "zustand/react";
import {createJSONStorage, persist} from "zustand/middleware";
import {jwtDecode} from "jwt-decode";
import {withLocalStorage} from "@/lib/utils/localStorage";
import {Token} from "@/lib/types/localStorage";
import {AuthState, Role} from "@/lib/types/auth";

interface JWTPayload {
    exp: number;
    iat: number;
    identifier: {
        id: string;
        email: string;
        role: Role;
    }
}

const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
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
                    console.log(decodedToken);
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
                            id: decodedToken.identifier.id,
                            email: decodedToken.identifier.email,
                            role: decodedToken.identifier.role
                        }})
                }catch(err: any){
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