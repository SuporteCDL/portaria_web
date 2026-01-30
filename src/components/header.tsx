import logocdl from '@/assets/cdl.png'
import logout from '@/assets/logout.svg'
import user from '@/assets/user.svg'
import menu from '@/assets/menu.svg'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from 'react-router-dom'

export default function Header() {

  return (
    <>
      <div className="w-full h-20 bg-slate-200 flex flex-row items-center pl-4">
        <div className='flex flex-1 items-center'>
          <img src={logocdl} alt='CDL Anápolis' width={100} />
          <h1 className='pl-8 text-cyan-800 font-bold text-xl'>CONTROLE DE ENTRADAS E SAÍDAS</h1>
        </div>
        <div className='flex flex-row gap-4 pr-4'>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost">
                <img src={menu} alt='Menu' width={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link to='/'>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to='/entradas'>Lançar entradas</Link>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Relatórios</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>
                        Quantidade de Atendimentos
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Sair
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>          
        </div>
      </div>
    </>
  )
}
