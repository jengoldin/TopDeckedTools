import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('../tabs/tabs.module').then((m) => m.TabsPageModule),
    },
    {
        path: 'lifeCounter',
        loadChildren: () =>
            import('../pages/life/modal/counter.module').then((m) => m.CounterPageModule),
    },
];
@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
